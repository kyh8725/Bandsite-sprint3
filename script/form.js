function createInsertBefore(name, parent, type, itemId) {
  let child = document.createElement(type);
  child.classList.add(name);
  child.id = itemId;
  let parents = document.querySelector(parent);
  parents.insertBefore(child, parents.childNodes[0]);
  return child;
}

function createAppend(name, parent, type, itemId) {
  let child = document.createElement(type);
  child.classList.add(name);
  child.id = itemId;
  parent.appendChild(child);
  if (name === "conv__delete-button") {
    child.addEventListener("click", event => {
      event.preventDefault();
      axios
        .delete(
          "https://project-1-api.herokuapp.com/comments/" +
            child.id +
            "?api_key=Daniel1"
        )
        .then(response => {
          document.querySelector(".conv__wrapper").innerText = "";
          printData();
        });
    });
  }
  return child;
}

function structureHtml(itemId) {
  let firstDiv = createInsertBefore(
    "conv__comment",
    ".conv__wrapper",
    "div",
    itemId
  );
  let secondDiv = createAppend("conv__comment-left", firstDiv, "div");
  let img = createAppend("comment-img", secondDiv, "img");
  let thirdDiv = createAppend("conv__comment-right", firstDiv, "div");
  let fourthDiv = createAppend("conv__comment-right-top", thirdDiv, "div");
  let commentName = createAppend(
    "conv__comment-right-top-name",
    fourthDiv,
    "p"
  );
  let commentDate = createAppend(
    "conv__comment-right-top-date",
    fourthDiv,
    "p"
  );
  let paragraphDiv = createAppend("conv__comment-paragraph", thirdDiv, "div");
  let paragraph = createAppend(
    "conv__comment-paragraph-text",
    paragraphDiv,
    "p"
  );
  let button = (createAppend(
    "conv__delete-button",
    paragraphDiv,
    "button",
    itemId
  ).innerText = "DELETE");
  let structure = {
    img: img,
    commentName: commentName,
    commentDate: commentDate,
    comment: paragraph
  };
  return structure;
}

function getDate(timestamp) {
  let currentTime = new Date().getTime();
  let diffMs = currentTime - timestamp;
  let diffS = diffMs / 1000;
  let diffM = diffMs / 60000;
  let diffH = diffMs / 3600000;
  let diffD = diffMs / 86400000;
  let diffMo = diffMs / 2629800000;
  let diffY = diffMs / 31557600000;

  let result = "";

  if (diffY >= 1) {
    diffY < 2
      ? (result = Math.floor(diffY) + " year ")
      : Math.floor(diffY) + " years ";
    let tempMo = diffMo % 12;
    tempMo < 2
      ? (result += Math.floor(tempMo) + " month ago")
      : (result += Math.floor(tempMo) + " months ago");
  } else {
    if (diffMo > 1 && diffMo < 12) {
      diffMo < 2
        ? (result = Math.floor(diffMo) + " month ")
        : (result = Math.floor(diffMo) + " months ");
      let tempD = diffD % 31;
      tempD < 2
        ? (result += Math.floor(tempD) + " day ago")
        : (result += Math.floor(tempD) + " days ago");
    } else {
      // assumming 1 month = 31 days;
      if (diffD > 1 && diffD < 31) {
        diffD < 2
          ? (result = Math.floor(diffD) + " day ")
          : (result = Math.floor(diffD) + " days ");
        let tempH = diffH % 24;
        tempH < 2
          ? (result += Math.floor(tempH) + " hour ago")
          : (result += Math.floor(tempH) + " hours ago");
      } else {
        if (diffH > 1 && diffH < 24) {
          diffH < 2
            ? (result = Math.floor(diffH) + " hour ")
            : (result = Math.floor(diffH) + " hours ");
          let tempM = diffM % 60;
          tempM < 2
            ? (result += Math.ceil(tempM) + " min ago")
            : (result += Math.ceil(tempM) + " mins ago");
        } else {
          if (diffM > 0 && diffM < 1) {
            let tempS = diffS % 1000;
            diffS < 1
              ? (result = Math.ceil(tempS) + " second ago")
              : (result = Math.ceil(tempS) + " seconds ago");
          } else {
            diffM > 0 && diffM < 1.99
              ? (result = Math.round(diffM) + " min ago")
              : (result = Math.round(diffM) + " mins ago");
          }
        }
      }
    }
  }
  return result;
}

function displayComment(commentObject) {
  let commentHtml = structureHtml(commentObject.id);
  commentHtml.commentName.innerText = commentObject.name;
  commentHtml.commentDate.innerText = getDate(commentObject.timestamp);
  commentHtml.comment.innerText = commentObject.comment;
  commentHtml.img.setAttribute("src", "../assets/Images/face3.png");
}

function printData() {
  axios
    .get("https://project-1-api.herokuapp.com/comments?api_key=Daniel1")
    .then(response => {
      for (object of response.data) {
        displayComment(object, response.data.id);
      }
    });
}

printData();
const form = document.querySelector(".conv__join");
form.addEventListener("submit", event => {
  event.preventDefault();
  let names = event.target.name.value;
  let comments = event.target.comment.value;
  if (names !== "" && comments !== "") {
    axios
      .post("https://project-1-api.herokuapp.com/comments?api_key=Daniel1", {
        name: names,
        comment: comments
      })
      .then(response => {
        document.querySelector(".conv__wrapper").innerText = "";
        printData();
        event.target.name.value = "";
        event.target.comment.value = "";
      });
  } else {
    window.alert("Please fill both name and comment");
  }
});
