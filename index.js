let ids = ["click", "doubleclick", "pressandhold"]
let events = []
let dataFileUrl = null

function SaveLogFile() {
  let data = new Blob([JSON.stringify(events, null, 2)], { type: 'application/json' });

  // IF WE ARE REPLACING A PREVIOUSLY GENERATED FILE WE NEED TO
  // MANUALLY REVOKE THE OBJECT URL TO AVOID MEMORY LEAKS.
  if (dataFileUrl !== null) {
    window.URL.revokeObjectURL(dataFileUrl);
  }
  dataFileUrl = window.URL.createObjectURL(data);

  let anchor = document.createElement('a')
  anchor.setAttribute('href', dataFileUrl)
  anchor.setAttribute('download', "pen-events.json")
  anchor.style.display = 'none'
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
}

function LogEvent(evt) {
  let event = {}
  for (const key in evt) {
    if (!['path', 'target', 'currentTarget', 'view', 'srcElement'].includes(key))
      event[key] = evt[key]
  }
  events.push(event)
}

window.onload = _ => {
  ids.forEach((id) => {
    window.addEventListener("penbutton" + id, (event) => {
      console.log(event)
      let div = document.querySelector("#" + id)
      div.classList.add("pressed")

      if (div.timeout)
        clearTimeout(div.timeout)

      div.timeout = setTimeout(() => {
        div.classList.remove("pressed")
      }, 250)

      LogEvent(event)
    })
  })

  window.addEventListener("pendockchange", (event) => {
    console.log(event)
    let div = document.querySelector(event.docked ? "#dock" : "#undock")
    div.classList.add("pressed")

    if (div.timeout)
      clearTimeout(div.timeout)

    div.timeout = setTimeout(() => {
      div.classList.remove("pressed")
    }, 250)

    LogEvent(event)
  })
}