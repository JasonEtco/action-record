import Joi from '@hapi/joi'
import nock from 'nock'
import uuid from 'uuid'
import Model from '../src/model'
import Instance from '../src/instance'

describe('Model', () => {
  let model: Model

  beforeEach(() => {
    model = new Model({
      name: 'user',
      schema: Joi.object({
        login: Joi.string()
      })
    })

    nock('https://api.github.com')
      .get(/^\/search\/issues\?q=/).reply(200, {
        items: [{
          number: 1,
          labels: [{ name: model.name }],
          created_at: '2009-07-12T20:10:41Z',
          body: Model.jsonToBody({ action_record_id: '29da0a67-062a-46f8-b397-7eac68513492', foo: true, login: 'JasonEtco' })
        }, {
          number: 2,
          labels: [{ name: model.name }],
          created_at: '2009-07-12T20:10:41Z',
          body: Model.jsonToBody({ action_record_id: '66eb86bd-046b-40b4-9d74-e81c41360ae3', foo: false, login: 'SomeoneElse' })
        }, {
          number: 3,
          labels: [{ name: model.name }],
          created_at: '2009-07-12T20:10:41Z',
          body: Model.jsonToBody({ action_record_id: '95820a71-1d88-41a7-b98c-b5e395cf4ec2', foo: true, login: 'Nope' })
        }]
      })
      .post(/.*\/.*\/issues/).reply(200, {
        number: 4,
        created_at: '2009-07-12T20:10:41Z'
      })
  })

  describe('#findOne', () => {
    it('returns the expected record', async () => {
      const record = await model.findOne({ login: 'JasonEtco' }) as Instance
      expect(record).toBeInstanceOf(Instance)
      expect(record.login).toBe('JasonEtco')
      expect(record).toMatchSnapshot()
    })

    it('returns null if no record was found', async () => {
      const record = await model.findOne({ login: 'nope' })
      expect(record).toBeNull()
    })
  })

  describe('#findAll', () => {
    it('returns the expected records', async () => {
      const records = await model.findAll()
      expect(records.length).toBe(3)
      expect(records.every(record => record instanceof Instance)).toBe(true)
    })

    it('returns the expected records with a `where` object', async () => {
      const records = await model.findAll({ foo: true })
      expect(records.length).toBe(2)
      expect(records.every(record => record.foo)).toBe(true)
      expect(records.every(record => record instanceof Instance)).toBe(true)
    })

    it('returns an empty array if no records were found', async () => {
      const records = await model.findAll({ foo: 'pizza' })
      expect(records).toEqual([])
    })
  })

  describe('#create', () => {
    beforeEach(() => {
      process.env.GITHUB_REPOSITORY = 'JasonEtco/example'
    })

    afterEach(() => {
      delete process.env.GITHUB_REPOSITORY
    })

    it('creates and returns the expected record', async () => {
      jest.spyOn(uuid, 'v4').mockReturnValueOnce('new-uuid')
      const newRecord = await model.create({ login: 'matchai' })
      expect(newRecord).toBeInstanceOf(Instance)
      expect(newRecord.login).toBe('matchai')
      expect(newRecord).toMatchSnapshot()
    })
  })
})