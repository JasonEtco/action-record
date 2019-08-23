import Joi from '@hapi/joi'
import nock from 'nock'
import Model from '../src/model'
import Instance from '../src/instance'

describe('Instance', () => {
  let instance: Instance
  let model: Model

  beforeEach(() => {
    model = new Model({
      name: 'user',
      schema: Joi.object({
        login: Joi.string()
      })
    })

    instance = new Instance(model, {
      issue_number: 1,
      action_record_id: '123abc',
      created_at: 'now'
    })

    nock('https://api.github.com')
      .patch(/^\/.*\/.*\/issues\/\d+$/).reply(200)
  })

  describe('#destroy', () => {
    beforeEach(() => {
      process.env.GITHUB_REPOSITORY = 'JasonEtco/example'
    })

    afterEach(() => {
      delete process.env.GITHUB_REPOSITORY
    })

    it('returns the expected record', async () => {
      await instance.destroy()
      expect(nock.isDone()).toBe(true)
    })
  })
})