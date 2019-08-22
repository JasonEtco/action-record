<h3 align="center">ActionRecord</h3>

<p align="center">
  ⚠️<strong>This is extremely WIP. Please don't use it or open issues just yet!</strong>⚠️
</p>

<p align="center">
  📑 An "ORM" for storing data in a GitHub repository using GitHub Actions<br>
  <a href="#usage">Usage</a> •
  <a href="#faq">FAQ</a>
</p>

## Usage

ActionRecord works by running JavaScript functions in the repository to decide how and where to store the provided raw data.

Including it should be as simple as using the action in your `.github/workflows` file with the `GITHUB_TOKEN` secret:

```yaml
steps:
  - uses: JasonEtco/action-record
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

This will tell ActionRecord to run a JavaScript file called `/action-record/events/<EVENT>.js`, where `EVENT` is the the event name that triggered the workflow.

## Event handlers

These should be JavaScript files that export a function that takes one argument, an instance of the [ActionRecord class](./src/action-record.ts):

```js
module.exports = async action => {
  // Do stuff
}
```

An example use-case is to store arbitrary data as issues, categorized by labels. For example, we can create a new issue with the label `user` to store any new user that pushes to a repo. We do this by defining a `user` model, and then using typical ORM methods in our specific event handler. ActionRecord will load all models from `action-record/models` before running the event handler, and put them onto `action.models`.

```js
// action-record/models/user.js
module.exports = ({ Joi }) => ({
  name: 'user',
  schema: {
    login: Joi.string().meta({ unique: true })
  }
})

// action-record/events/push.js
module.exports = async action => {
  await action.models.user.create({
    login: action.event.payload.sender.login
  })
}
```

This will create a new issue with a label `user`:

<IMAGE OF NEW `USER` ISSUE>

## Querying for data

Need to query your "database"? No problem! Like most ORMs, each model gets `findOne` and `findAll` methods. These take an object argument to do some basic filtering.

```js
// action-record/events/push.js
module.exports = async action => {
  await action.models.user.create({ login: 'JasonEtco' })
  const record = await action.models.user.findOne({ login: 'JasonEtco' })
  console.log(record)
  // -> { login: 'JasonEtco', created_at: 1566405542797, action_record_id: '085aed5c-deac-4d57-bcd3-94fc10b9c50f', issue_number: 1 }
}
```

### Models

Models function similar to any other ORM; they require a name and a schema, and can define "hooks":

```js
// action-record/models/user.js
module.exports = ({ Joi }) => ({
  name: 'user'
  // A Joi schema that will be run to validate any new records
  schema: {
    login: Joi
      .string()
      .meta({ unique: true })
  },
  hooks: {
    beforeCreate: async candidateRecord => {},
    afterCreate: async newRecord => {}
  }
})
```

#### Available hooks

Here's a list of all of the available hooks, in the order in which they run:

```
beforeCreate
beforeValidate
afterValidate
beforeSave
afterSave
afterCreate
```

### Options

```yml
steps:
  - uses: JasonEtco/action-record
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    with:
      baseDir: action-record
```


## FAQ

**Should I use this in producti-**

**No.** This was made as an experiment - there are far too many reasons not to actually use this. But, if you choose to, awesome!

**This is dumb. You shouldn't use GitHub or Actions as a datastore.**

Yes. That isn't a question, but I don't disagree. The point of this is to show that we _can_, not that we should.
