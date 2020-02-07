let showData = [];
axios
  .get("https://project-1-api.herokuapp.com/showdates?api_key=daniel")
  .then(response => {
    showData = response.data;
    presentShow();
  });

function createAddShow(name, parent, type) {
  let child = document.createElement(type);
  child.classList.add(name);
  parent.appendChild(child);
  return child;
}

//structuring the show table and assigning the values
function presentShow() {
  for (obj of showData) {
    let showContent = createAddShow(
      "content__right-single",
      contentRight,
      "div"
    );
    createAddShow("content__show-date-title", showContent, "h3").innerText =
      "DATE";
    createAddShow("content__show-date", showContent, "p").innerText = obj.date;
    createAddShow("content__show-venue-title", showContent, "h3").innerText =
      "VENUE";
    createAddShow("content__show-venue", showContent, "p").innerText =
      obj.place;
    createAddShow("content__show-location-title", showContent, "h3").innerText =
      "LOCATION";
    createAddShow("content__show-location", showContent, "p").innerText =
      obj.location;
    createAddShow("content__show-button", showContent, "button").innerText =
      "BUY TICKETS";
    createAddShow("content__show-divider", contentRight, "p");
  }
}

function createAdd(name, parent, type) {
  parent = document.querySelector(parent);
  let child = document.createElement(type);
  child.classList.add(name);
  parent.appendChild(child);
  return child;
}
//structure HTML for header and info title (dates venue location).
createAdd("content", ".main", "div");
createAdd("content__left", ".content", "div");
createAdd("content__header", ".content__left", "div").innerText = "Shows";
let contentRight = createAdd("content__right", ".content", "div");
createAdd("content__info-title", ".content__right", "div");

//dates venue locations -- titles invisible in mobile version
createAdd("content__info-title-date", ".content__info-title", "p").innerText =
  "DATES";
createAdd("content__info-title-venue", ".content__info-title", "p").innerText =
  "VENUE";
createAdd(
  "content__info-title-location",
  ".content__info-title",
  "p"
).innerText = "LOCATION";
createAdd("content__info-title-dummie", ".content__info-title", "p");
