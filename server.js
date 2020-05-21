const express = require('express')

const {db,Todos} = require('./db')

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/', express.static(__dirname + '/front'))

db.sync().then(() => {
    app.listen(3000)
})
    .catch((err) => {
        console.error(err)
    })

app.get('/todo',async(req,res) =>{
    const todos = await Todos.findAll()
    res.send(todos)
})

app.get('/todo/:id', async (req, res) => {
    if(isNaN(Number(req.params.id))){
        return res.status(404).send({error:'todo id must be ab integer'})
    }

    const todo = await Todos.findByPk(Number(req.params.id))

    if(!todo){
        return res.status(404).send({
            error: 'No todo found with id = ' + req.params.id,
        })
    }

    res.send(todo);
})

app.post('/add',async(req,res) => {
    if(typeof req.body.task !=='string'){
        return res.status(404).send({ error: 'Task name must be provided'})
    }


    const newTodo = await Todos.create({
        task: req.body.task,
        done: req.body.done,
        due: req.body.due,
    })
    res.status(201).send({ success: 'New task added', data: newTodo })
})

app.put('/todos',async(req,res)=>{

    Todos.update(
        { done: req.body.done },
        { where: { id: Number(req.body.id)} }
    )
        .success(result =>
            handleResult(result)
        )
        .error(err =>
            handleError(err)
        )
    res.status(201);
})

app.get('/remove', async(req,res) =>{

    Todos.destroy({
        where: {
            done: true,
        }
    })

    res.status(201).send({});
})

