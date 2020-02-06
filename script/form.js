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
      ? (result = Math.floor(diffY) + " yr ")
      : (result = Math.floor(diffY) + " yrs ");
    let tempMo = diffMo % 12;
    tempMo < 2
      ? (result += tempMo.toFixed(0) + " mth ago")
      : (result += tempMo.toFixed(0) + " mths ago");
  } else {
    if (diffMo > 1 && diffMo < 12) {
      diffMo < 2
        ? (result = diffMo.toFixed(0) + " mth ")
        : (result = diffMo.toFixed(0) + " mths ");
      let tempD = diffD % 31;
      tempD < 2
        ? (result += tempD.toFixed(0) + " day ago")
        : (result += tempD.toFixed(0) + " days ago");
    } else {
      // assumming 1 month = 31 days;
      if (diffD > 1 && diffD < 31) {
        diffD < 2
          ? (result = diffD.toFixed(0) + " day ")
          : (result = diffD.toFixed(0) + " days ");
        let tempH = diffH % 24;
        tempH < 2
          ? (result += tempH.toFixed(0) + " hr ago")
          : (result += tempH.toFixed(0) + " hrs ago");
      } else {
        if (diffH > 1 && diffH < 24) {
          diffH < 2
            ? (result = diffH.toFixed(0) + " hr ")
            : (result = diffH.toFixed(0) + " hrs ");
          let tempM = diffM % 60;
          tempM < 2
            ? (result += Math.floor(tempM) + " min ago")
            : (result += tempM.toFixed(0) + " mins ago");
        } else {
          if (diffM > 0 && diffM < 1) {
            let tempS = diffS % 1000;
            diffS < 1
              ? (result = Math.ceil(tempS) + " second ago")
              : (result = tempS.toFixed(0) + " seconds ago");
          } else {
            diffM > 0 && diffM < 1.99
              ? (result = Math.floor(diffM) + " min ago")
              : (result = diffM.toFixed(0) + " mins ago");
          }
        }
      }
    }
  }
  return result;
}

//creates html tag and add it to parent tag as a first element.
function createBefore(name, parent, type, itemId) {
  let child = document.createElement(type);
  child.classList.add(name);
  child.id = itemId;
  let parents = document.querySelector(parent);
  parents.insertBefore(child, parents.childNodes[0]);
  return child;
}
//creates html tag and add it to parent tag.
function createAfter(name, parent, type, itemId) {
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
            "?api_key=Daniel"
        )
        .then(response => {
          const deletedDiv = document.getElementById(response.data.id);
          deletedDiv.style.display = "none";
        });
    });
  }
  return child;
}

function structureHtml(itemId) {
  let firstDiv = createBefore("conv__comment", ".conv__wrapper", "div", itemId);
  let secondDiv = createAfter("conv__comment-left", firstDiv, "div");
  let img = createAfter("comment-img", secondDiv, "img");
  let thirdDiv = createAfter("conv__comment-right", firstDiv, "div");
  let fourthDiv = createAfter("conv__comment-right-top", thirdDiv, "div");
  let commentName = createAfter("conv__comment-right-top-name", fourthDiv, "p");
  let commentDate = createAfter("conv__comment-right-top-date", fourthDiv, "p");
  let paraDiv = createAfter("conv__comment-paragraph", thirdDiv, "div");
  let paragraph = createAfter("conv__comment-paragraph-text", paraDiv, "p");
  createAfter("conv__delete-button", paraDiv, "button", itemId).innerText =
    "DELETE";
  let structure = {
    img: img,
    commentName: commentName,
    commentDate: commentDate,
    comment: paragraph
  };
  return structure;
}

function displayComment(commentObject) {
  let html = structureHtml(commentObject.id);
  html.commentName.innerText = commentObject.name;
  html.commentDate.innerText = getDate(commentObject.timestamp);
  html.comment.innerText = commentObject.comment;
  html.img.src = "./assets/Images/face3.png";
}

function getDataPrint() {
  axios
    .get("https://project-1-api.herokuapp.com/comments?api_key=Daniel")
    .then(response => {
      const commentWrapper = document.querySelector(".conv__wrapper");
      commentWrapper.innerHTML = "";
      for (obj of response.data) {
        displayComment(obj);
      }
    });
  // for updating the comment time every 900ms
  //setTimeout(getDataPrint, 900);
}

getDataPrint();
const form = document.querySelector(".conv__join");
form.addEventListener("submit", event => {
  event.preventDefault();
  let names = event.target.name.value;
  let comments = event.target.comment.value;
  if (names !== "" && comments !== "") {
    axios
      .post("https://project-1-api.herokuapp.com/comments?api_key=Daniel", {
        name: names,
        comment: comments
      })
      .then(response => {
        getDataPrint();
        event.target.name.value = "";
        event.target.comment.value = "";
      });
  } else {
    window.alert("Please fill both name and comment");
  }
});
