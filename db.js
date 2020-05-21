const Sequelize = require('sequelize')

const db = new Sequelize({
    dialect: 'sqlite',
    storage: __dirname + '/test.db',
})

const Todos = db.define('Todo', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    task: {
        type: Sequelize.STRING(100),
        allowNull: false,
    },
    done: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
    due: {
        type: Sequelize.DATE
    }
})

module.exports = {
    db, Todos
}