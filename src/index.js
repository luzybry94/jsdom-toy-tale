let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  function renderToy(toyObj) {
    const toyDiv = document.createElement("div")
        toyDiv.className = "card"
        toyDiv.innerHTML = 
          `<h2>${toyObj.name}</h2>
          <img src=${toyObj.image} class="toy-avatar" />
          <p>${toyObj.likes} Likes </p>
          <button data-id=${toyObj.id} class="like-btn">Like <3</button>`
        const collectionDiv = document.querySelector("#toy-collection")
        collectionDiv.append(toyDiv)
  }

  fetch('http://localhost:3000/toys')
    .then(response => response.json())
    .then(toyArray => {
      for (toyObj of toyArray) {
         renderToy(toyObj)
      }
    });

  const form = document.querySelector(".add-toy-form")
  form.addEventListener("submit", (e) => {
    e.preventDefault()

    const name = e.target.name.value
    const image = e.target.image.value

    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
       'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "name": name,
        "image": image,
        "likes": 0
      })
     })
     .then(r => r.json())
     .then(toyObj => {
       renderToy(toyObj)
       e.target.reset()
     })
  })
  
  const collectionDiv = document.querySelector("#toy-collection")
  collectionDiv.addEventListener("click", event => {
    if (event.target.matches(".like-btn")) {
      const likesTag = event.target.previousElementSibling
      const likesCount = parseInt(likesTag.textContent)
      const id = event.target.dataset.id
      
      fetch(`http://localhost:3000/toys/${id}`, {
      method: 'PATCH',
      headers: {
       'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "likes": likesCount + 1
      })
     })
     .then(r => r.json())
     .then(toyObj => {
       likesTag.textContent = `${toyObj.likes} Likes`
     })

    }
  })




});
