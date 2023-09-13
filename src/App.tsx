import { useState, useEffect, useRef, useMemo, useCallback } from 'react'

export default function App() {

  const inputRef = useRef<HTMLInputElement>(null);
  const firstRender = useRef(true)

  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState<string[]>([])

  const [editTask, setEditTask] = useState({
    enabled:false,
    task: ''
  })

  useEffect( () => {
    const tarefaSalvas = localStorage.getItem("@cursoList")

    if(tarefaSalvas){
      setTasks(JSON.parse(tarefaSalvas))
    }
  }, [])

  useEffect( () => {
    if(firstRender.current) {
      firstRender.current = false;
      return
    }

    localStorage.setItem("@cursoList", JSON.stringify(tasks))
  }, [tasks]);

  const handleRegister = useCallback(() => {
    if (!input) {
      alert("Preencha uma tarefa!")
      return;
    }

    if (editTask.enabled){
      handleSaveEdit();
      return;
    }

    setTasks(tarefas => [...tarefas, input])
    setInput("")
  }, [input, tasks])

  function handleSaveEdit() {
    const findIndexTask = tasks.findIndex( task => task === editTask.task)
    const allTasks = [...tasks];

    allTasks[findIndexTask] = input;
    setTasks(allTasks);   

    setEditTask({
      enabled:false,
      task: ''
    })
    setInput("")
  }

  function handleDelete(toDo: string) { 
   const removeTask = tasks.filter(  task => task !== toDo)
   setTasks(removeTask)
  }

  function handleEdit(toDo: string) {

    inputRef.current?.focus();

    setInput(toDo)
    setEditTask({
      enabled:true,
      task:toDo
    })
  }

  const totalTarefas = useMemo(() => {
    return tasks.length
  }, [tasks])

  return (
    <div>
      <h1> Lista de tarefas</h1>

      <input
      placeholder='Digite a próxima tarefa'
      value={input}
      onChange={ (e) => setInput(e.target.value)}
      ref={inputRef}
      />

      <button onClick={handleRegister}> 
      {editTask.enabled ? "Atualizar tarefa" : "Adicionar tarefa"}
      </button>
      <hr/>

      <strong> Você tem {totalTarefas} tarefas! </strong>
      <br>
      </br>
      <br>
      </br>

      {tasks.map( (toDo, index) => (
        <section key={toDo}>
          <span> {toDo} </span>
          <button onClick={ () => handleEdit(toDo) }> Editar </button>
          <button onClick={ () => handleDelete(toDo)}> Excluir tarefa</button>
        </section>
        ))}
    </div>
  )
}
