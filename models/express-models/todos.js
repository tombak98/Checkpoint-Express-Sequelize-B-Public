let tasks = {}; //

/*
  tasks (defined above) will be a place to store tasks by person;
  example:
  {
    person1: [{task object 1}, {task object 2}, etc.],
    person2: [{task object 1}, {task object 2}, etc.],
    etc.
  }
*/

module.exports = {
  reset: function () {
    tasks = {}; // (this function is completed for you.)
  },

  // ==== COMPLETE THE FOLLOWING (SEE `model.js` TEST SPEC) =====
  listPeople: function () {
    // returns an array of all people for whom tasks exist
    let list = []
    for (let key in tasks) {
      list.push(key)
    }
    return list
  },

  add: function (name, task) {
    // saves a task for a given person
    if (!task.complete) {
      task.complete = false
    }
    if (name in tasks) {
      tasks[name].push(task)
    } else {
      tasks[name] = [task]
    }
  },

  list: function (name) {
    // returns tasks for specified person
    return tasks[name]
  },

  complete: function (name, idx) {
    // marks a task complete
    tasks[name][idx].complete = true
  },

  remove: function (name, idx) {
    // removes a tasks
    if (typeof idx === "string") {
      idx = parseFloat(idx)
    }
    let arr = []
    for (let i = 0; i < tasks[name].length; i++) {
      if (!(i === idx)) {
        arr.push(tasks[name][i])
      }
    }
    tasks[name] = arr
  },
};
