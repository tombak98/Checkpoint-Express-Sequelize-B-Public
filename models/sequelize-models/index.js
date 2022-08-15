const db = require('./database');
const Sequelize = require('sequelize');
const { Op } = require('sequelize')

// Make sure you have `postgres` running!

//---------VVVV---------  your code below  ---------VVV----------

const Task = db.define('Task', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  complete: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  due: Sequelize.DATE
});

// class methods
Task.clearCompleted = async function() {
  return await this.destroy({
    where: {complete: true}
  })
}

Task.completeAll = async function() {
  return await this.update(
    {
      complete: true,
    },
    {
      where: {complete: false},
    }
  )
}

// instance methods
Task.prototype.getTimeRemaining = function() {
  if (this.due > 0) {
    return (this.due - Date.now())
  } else {
    return Infinity
  }
}

Task.prototype.isOverdue = function() {
  if (this.getTimeRemaining() < 0) {
    if (this.complete === true) {
      return false
    } else {
      return true
    }
  } else {
    return false
  }
}

Task.prototype.assignOwner = async function(owner) {
  return this.setOwner(owner)
}
// end of Task methods

const Owner = db.define('Owner', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
});

// Owner Class methods
Owner.getOwnersAndTasks = async function() {
  return (await this.findAll({ include: Task }))
}

// Owner Instance Methods
Owner.prototype.getIncompleteTasks = async function() {
  return await Task.findAll({
    where: {
      OwnerId: this.id,
      complete: {[Op.not]:true}
    }
  })
}

Owner.beforeDestroy(owner => {
  if (owner.name === "Grace Hopper") {
    throw new Error("Can't delete Grace Hopper!")
  }
})

Task.belongsTo(Owner);
Owner.hasMany(Task);

//---------^^^---------  your code above  ---------^^^----------

module.exports = {
  Task,
  Owner,
};
