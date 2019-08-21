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

Including it should be as simple as using the action in your `.github/workflows` file:

```yaml
steps:
  - use: JasonEtco/action-record
```

This will tell ActionRecord to run a JavaScript file called `/action-record/events/<EVENT>.js`, where `EVENT` is the the event name that triggered the workflow.

You can override this by passing key/value pairs of `EVENT:FILENAME`

```yaml
steps:
  - use: JasonEtco/action-record
    with:
      events:
        issues: on-new-issue.js
```

## Your JavaScript files

These should all export a function that takes one argument, an instance of the [ActionRecord class]():

```js
module.exports = action => {
  // Do stuff
}
```

An example use-case is to store arbitrary data as issues, categorized by labels. For example, we can create a new issue with the label `user` to store a new user.

```js
// action-record/models/user.js
const { defineModel } = require('action-record')
const Joi = require('@hapi/joi')
module.exports = {
  name: 'user',
  schema: {
    login: Joi.string()
  }
}

// action-record/events/push.js
module.exports = action => {
  await action.models.user.create({
    login: action.event.payload.sender.login
  })
}
```

This will create a new issue with a label `user`:

<IMAGE OF NEW `USER` ISSUE>

### Options

```yml
steps:
  - use: JasonEtco/action-record
    with:
      baseDir: action-record
      events:
        event: file
```


## FAQ

**Should I use this in producti-**

**No.** This was made as an experiment - there are far too many reasons not to actually use this. But, if you choose to, awesome!
