//anti spam
let cooldown = true;
//func return height for question
function getHeight(elem) {
  return elem.getBoundingClientRect().height;
}
//func scroll question next
function scrollQuestion(elem) {
  const height = getHeight(elem);
  document.querySelector(".question-show").scrollTop += height;
}
//func listener click for answer
function listenerAnswerClick() {
  const answers = document.querySelectorAll(".answer");
  answers.forEach((answer) => {
    answer.addEventListener("click", () => {
      if (!cooldown) {
        return;
      }
      cooldown = false;
      const parent = answer.closest(".question");
      parent.classList.add("animated");
      setTimeout(() => {
        parent.classList.remove("animated");
        cooldown = true;
        // scrollQuestion(parent);
      }, 1000);
      console.log("hah");
    });
  });
}
listenerAnswerClick();

//process file from field input

document.getElementById("file").addEventListener("change", function(e) {
  const files = e.target.files;
  const file = files[files.length - 1];
  const fileName = this.closest(".wrapper").querySelector(".file-upload-name");

  if (file) {
    const reader = new FileReader();

    reader.onload = (event) => {
      fileName.textContent = file.name;
      document.getElementById('start').classList.add('enable')
      console.log("he", file.name);
    };

    reader.readAsDataURL(file);
  }
});
