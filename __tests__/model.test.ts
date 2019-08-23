import Joi from '@hapi/joi'
import nock from 'nock'
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
          body: '```\n{\n  "action_record_id": "some-string",\n  "login": "JasonEtco"\n}\n```'
        }]
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
      const record = await model.findOne({
        login: 'nope'
      })

      expect(record).toBeNull()
    })
  })

  describe('#findAll', () => {
    it.todo('returns the expected records')
    it.todo('returns the expected records with a `where` object')
    it.todo('returns null if no records were found')
  })
})