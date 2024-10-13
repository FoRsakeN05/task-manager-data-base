// Espera a que el DOM se cargue antes de ejecutar las funciones
document.addEventListener('DOMContentLoaded', loadTasks);
// Adjunta la función addTask al evento submit del formulario de tareas
document.getElementById('task-form').addEventListener('submit', addTask);

// Función para agregar una tarea
async function addTask(e) {
    e.preventDefault(); // Previene el comportamiento predeterminado de envío del formulario

    // Obtiene los valores de los campos de entrada
    const taskName = document.getElementById('task-name').value;
    const dueDate = document.getElementById('due-date').value;
    const project = document.getElementById('project').value;

    // Crea un objeto de tarea para enviar al servidor
    const task = {
        nombre: taskName,
        fecha: dueDate,
        prjct_nombre: project
    };

    // Envía la tarea al servidor
    const response = await fetch('http://localhost:3000/tareas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
    });

    // Verifica si la respuesta es correcta
    if (response.ok) {
        const newTask = await response.json(); // Analiza la respuesta JSON
        addTaskToDOM(newTask); // Agrega la nueva tarea al DOM
        document.getElementById('task-form').reset(); // Reinicia el formulario
    } else {
        alert('Error al agregar la tarea'); // Alerta si hubo un error
    }
}

// Función para cargar las tareas desde el servidor
async function loadTasks() {
    const response = await fetch('http://localhost:3000/tareas'); // Obtiene las tareas del servidor
    const data = await response.json(); // Analiza la respuesta JSON
    
    // Itera sobre cada tarea y la agrega al DOM
    data.tareas.forEach(task => {
        addTaskToDOM(task);
    });
}

// Función para agregar una tarea al DOM
function addTaskToDOM(task) {
    const taskRow = document.createElement('tr'); // Crea una nueva fila para la tarea
    taskRow.setAttribute('data-id', task.id); // Establece un atributo de datos para el ID de la tarea
    taskRow.classList.toggle('completed', task.completada); // Agrega la clase 'completed' si la tarea está completada

    // Rellena el contenido de la fila con los datos de la tarea
    taskRow.innerHTML = `
        <td>
            <input type="checkbox" class="complete-btn" ${task.completada ? 'checked' : ''}>
        </td>        
        <td>${task.nombre}</td>
        <td>${task.fecha}</td>
        <td>${task.prjct_nombre}</td>
        <td>
            <button class="delete-btn">Eliminar</button>
        </td>
    `;

    // Agrega la fila de tarea al cuerpo de la tabla
    document.getElementById('task-list').appendChild(taskRow);
}

// Delegación de eventos para eliminar o completar una tarea
document.getElementById('task-list').addEventListener('click', async function(e) {
    const taskRow = e.target.parentElement.parentElement; // Obtiene la fila de la tarea
    const taskId = taskRow.getAttribute('data-id'); // Obtiene el ID de la tarea
    console.log('Task ID:', taskId); // Verifica el ID de la tarea

    if (e.target.classList.contains('delete-btn')) {
        await deleteTask(taskId); // Llama a la función de eliminación
        taskRow.remove(); // Elimina la fila del DOM
    } else if (e.target.classList.contains('complete-btn')) {
        toggleTaskCompletion(taskId, taskRow); // Marca la tarea como completada o no
    }
});

// Función para eliminar una tarea
async function deleteTask(taskId) {
    const response = await fetch(`http://localhost:3000/tareas/${taskId}`, {
        method: 'DELETE' // Método de eliminación
    });

    if (!response.ok) {
        alert('Error al eliminar la tarea'); // Alerta si hubo un error
    }
}

// Función para alternar el estado de completado de una tarea
async function toggleTaskCompletion(taskId, taskRow) {
    const isCompleted = taskRow.classList.toggle('completed'); // Alterna la clase 'completed'

    try {
        // Actualiza el estado de la tarea en la base de datos
        const response = await fetch(`http://localhost:3000/tareas/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completada: isCompleted ? 1 : 0 }) // Envía el nuevo estado
        });

        if (!response.ok) {
            const errorText = await response.text(); // Obtiene el texto de error
            console.error('Error response:', errorText);
            alert(`Error al actualizar el estado de la tarea: ${response.status} ${response.statusText}`);
            // Revierta el cambio de clase si la actualización falla
            taskRow.classList.toggle('completed');
        } else {
            // Si la tarea se marca como completada, mueve la tarea al final de la lista tras la transición
            if (isCompleted) {
                const taskList = document.getElementById('task-list');
                
                // Escucha el evento 'transitionend' para mover el elemento tras la animación
                taskRow.addEventListener('transitionend', function onTransitionEnd() {
                    // Mueve la tarea al final de la lista después de la animación
                    taskList.appendChild(taskRow);
                    taskRow.removeEventListener('transitionend', onTransitionEnd); // Evita múltiples llamadas
                });
                // Aplica una animación suave antes de mover la tarea
                taskRow.classList.add('move-to-end'); // Añadir clase para animación
            }
        }
    } catch (error) {
        console.error('Fetch error:', error);
        alert('Error al actualizar el estado de la tarea: ' + error.message);
        // Revierta el cambio de clase si la actualización falla
        taskRow.classList.toggle('completed');
    }
}


// Función para refrescar la lista de tareas (limpiar y recargar tareas del servidor)
function refreshTaskList() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = ''; // Limpia la lista de tareas
    loadTasks(); // Carga las tareas nuevamente
}