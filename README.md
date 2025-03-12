[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/jeAbMzt9)


# Lista de Seguimiento

Lista de seguimiento para elementos de varios tipos.  
Hecha por Alex Pace.

## Índice

- [Descripción](#descripción)
- [Idea Inicial](#idea-inicial)
- [Instalación](#instalación)
- [Uso](#uso)


## Descripción

Este proyecto es una aplicación de escritorio construida con [Electron](https://www.electronjs.org/). Tiene como objetivo servir como lista de seguimiento de elementos de varios tipos, como "movie", "book" o "game". Se puede determinar el estado de cada elemento,
teniendo opciones como "pending", "processing" o "completed". Permite eliminar, añadir, modificar, filtrar y ordenar la lista.
Tiene un error checking detallado en cada apartado de la aplicacion.

## Idea Inicial

La idea de diseño inicial hecha con draw.io es la siguiente:

![idea inicial](./others/drawio.png)


## Instalación

Pasos para instalar y ejecutar el proyecto en tu ordenador:


### Requisitos previos

Tienes Node.js y NPM instalados?

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)


### Pasos

1. Clona el repositorio:

    ```bash
    git clone https://github.com/usuario/nombre-del-repositorio.git
    ```

2. Navega al directorio del proyecto:

    ```bash
    cd nombre-del-repositorio
    ```

3. Instala las dependencias:

    ```bash
    npm install
    ```

4. Inicia la aplicación:

    ```bash
    npm start
    ```


## Uso

Para añadir un elemento presione "New", para más opciones sobre el elemento presione los tres puntos en la parte derecha de dicha tarea,
y se mostrará un menu desplegable con opciones para editar el estado, editar el elemento o eliminarlo. Haga hover para un momento encima del nombre del elemento para ver sus notas. Para filtrar presione los checkboxes con el valor que quieres que se muestre, y para ordenar elija del desplegable, y si quiere invertir la lista presione "Descending?". Para filtrar por rango, introduzca ambos valores y la lista se filtrará automaticamente. Para buscar, introduzca el texto deseado en la barra de busqueda, y se buscará automáticamente por nombre del elemento (startsWith), o por contenido de sus notas (includes).


## Problemas encontrados

Los problemas encontrados fueron el apartado relacionado con la persistencia, es decir escribir en JSON y leer del archivo, y hacer que los filtros
se aniden. La persistencia se ha solucionado modificando el constructor de la clase list.js, ya que no creaba elementos, si no objetos cualquiera.
En cuanto a los filtros, me he decantado para una interfaz más amigable que permita filtrar de manera consecutiva los elementos deseados.