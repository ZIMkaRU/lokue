const _ = require('lodash')
const Lokue = require(`${__dirname}./../index`)

const lok = new Lokue({
  name: 'lokue-test.json',
  persist: true,
  concurrency: 10,
  timeout_save: 50,
  timeout_save: 100
})

lok.init((err) => {
  let ix = 0

  setInterval(() => {
    ix++
    lok.addJob({ hello: 'world' + ix })
  }, 100)
})

lok.on('job', job => {
  console.log('processing', job.data)
  job.done()
})

setInterval(() => {
  if (lok.isReady()) {
    lok.requeueStuckJobs()
    lok.clearCompletedJobs()
  }
}, 1000)

process.on('SIGINT', () => {
  if (lok.isReady()) {
    lok.stop(() => {
      console.log('saved')
      process.exit()
    }) 
  } else {
    process.exit()
  }
})
