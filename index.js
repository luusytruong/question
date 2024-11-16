const correctSound = new Audio("./sound/correct2.mp3");
const wrongSound = new Audio("./sound/wrong.mp3");
const levelUpSound = new Audio("./sound/levelUp.mp3");
const finishedSound = new Audio("./sound/finished.mp3");
// Preload all sounds
correctSound.load();
wrongSound.load();
levelUpSound.load();
finishedSound.load;
//func sound eff
async function sound(type) {
  let sound = null;
  if (type == "correct") {
    sound = correctSound;
  } else if (type == "wrong") {
    sound = wrongSound;
  } else if (type == "levelUp") {
    sound = levelUpSound;
  } else if (type == "finished") {
    sound = finishedSound;
  }
  try {
    if (sound) {
      sound.currentTime = 0;
      await sound.play();
    }
  } catch (err) {
    console.log(err);
  }
}
//anti spam
let cooldown = true;
//func return height for question
function getHeight(elem) {
  return elem.getBoundingClientRect().height;
}
//func scroll question next
function scrollQuestion(elem) {
  const height = getHeight(elem);
  document.querySelector(".question-show-wrapper").scrollTop += height;
}
//
let currentTranslate = 0;
function trasnformTranslate(elem) {
  currentTranslate += getHeight(elem);
  const list = document.querySelector(".question-list");
  list.style.transform = `translateY(-${currentTranslate}px)`;
  console.log("hah", currentTranslate);
}
//func listener click for answer
async function listenerAnswerClick() {
  const answers = document.querySelectorAll(".answer");
  answers.forEach((answer) => {
    answer.addEventListener("click", async () => {
      const parent = answer.closest(".question");
      if (parent.classList.contains("answered")) {
        console.log("da tl r");
        return;
      }
      if (!cooldown) {
        return;
      }
      cooldown = false;
      const correctAnswer = parent
        .querySelector(".correct-answer")
        .innerText.trim()
        .toString();
      const currentAnswer = answer
        .querySelector(".answer-body p")
        .innerText.trim()
        .toString();
      if (currentAnswer === correctAnswer) {
        await sound("correct");
        answer.classList.add("correct");
        questionPass++;
        document.querySelector(".count-correct-answer span").innerText =
          questionPass;
        if (questionPass % 10 === 0) {
          setTimeout(async () => {
            await sound("levelUp");
          }, 300);
        }
      } else {
        await sound("wrong");
        answer.classList.add("wrong");
        questionWrong++;
        document.querySelector(
          ".count-correct-answer strong:last-child span"
        ).innerText = questionWrong;
      }
      parent.classList.add("answered");
      parent.classList.add("animated");
      setTimeout(async () => {
        parent.classList.remove("animated");
        cooldown = true;
        // scrollQuestion(parent);
        trasnformTranslate(parent);
      }, 600);
    });
  });
}

//process file from field input
document.getElementById("file").addEventListener("change", function (e) {
  const files = e.target.files;
  const file = files[files.length - 1];
  const fileName = this.closest(".wrapper").querySelector(".file-upload-name");

  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      fileName.textContent = file.name;
      localStorage.setItem("fileName", JSON.stringify(file.name));
      console.log("he", file.name);
      try {
        const jsonData = JSON.parse(event.target.result);
        if (jsonData.questions) {
          console.log(jsonData);
          localStorage.setItem("questions", JSON.stringify(jsonData.questions));
          loadQuestions();
          console.log("da luu");
        } else {
          console.error("json khong dung yeu cau");
        }
      } catch (error) {
        console.error("loi khi phan tich json", error);
      }
    };
    reader.readAsText(file);
  }
});

//func check json data from local
function checkData() {
  const jsonData = JSON.parse(localStorage.getItem("questions"));
  const jsonName = JSON.parse(localStorage.getItem("fileName"));
  let found = false;
  if (jsonData && jsonName) {
    // console.log("co data", jsonData, jsonName);
    document.getElementById("start").classList.add("enable");
    document.querySelector(".file-upload-name").textContent = jsonName;
    listenerBtnStart();
    listenerBtnRemove();
    found = true;
  } else {
    console.log("kco data");
    document.getElementById("start").classList.remove("enable");
  }
  return found;
}
//func listenner click start button
function listenerBtnStart() {
  document
    .querySelector("button.enable")
    .addEventListener("click", function () {
      console.log(this);
      document.querySelector(".json-input").classList.remove("active");
      document.querySelector(".overlay").classList.remove("active");
      startCountUpTime();
    });
}
//func listenner click remove button
function listenerBtnRemove() {
  document.getElementById("remove").addEventListener("click", () => {
    localStorage.removeItem("questions");
    localStorage.removeItem("fileName");
    window.location.href = "./";
  });
}
//func create ele question
function createElemQuestion(index, question, correct, options) {
  const optionElem = options
    .map(
      (option, index) =>
        `
        <li class="answer">
            <div class="answer-head">
                ${String.fromCharCode(65 + index)}
            </div>
            <div class="answer-body">
                <p>
                    ${option}
                </p>
            </div>
        </li>
    `
    )
    .join(" ");
  const html = `
        <div class="question-head">
            <div class="question-num">
                <strong>#<span>${index + 1}</span></strong>
            </div>
            <div class="question-content">
                <p>
                    ${question}
                </p>
            </div>
            <div class="correct-answer">
                <p>
                    ${correct}
                </p>
            </div>
        </div>
        <ul class="question-body">
            ${optionElem}
        </ul>
    `;
  const questionElem = document.createElement("div");
  questionElem.className = "question";
  questionElem.innerHTML = html;
  return questionElem;
}
//func load question
let questionNum = 0;
let questionPass = 0;
let questionWrong = 0;
function loadQuestions() {
  document.querySelector(".wait").classList.add("active");
  if (checkData()) {
    const jsonDatas = JSON.parse(localStorage.getItem("questions"));
    document.querySelector(".question-list").innerHTML = "";
    questionNum = jsonDatas.length;
    document.querySelector(".count-correct-answer span").innerText =
      questionPass;
    document.querySelector(
      ".count-correct-answer strong:last-child span"
    ).innerText = questionWrong;
    console.log();
    jsonDatas.forEach((data, index) => {
      const questionElem = createElemQuestion(
        index,
        data.question,
        data.correct_answer,
        data.options
      );
      document.querySelector(".question-list").appendChild(questionElem);
    });
    listenerAnswerClick();
    setTimeout(() => {
      document.querySelector(".wait").classList.remove("active");
    }, 1000);
    // console.log(jsonDatas[0].options[0]);
  } else {
    console.log("kh co data de load");
    setTimeout(() => {
      document.querySelector(".wait").classList.remove("active");
    }, 1000);
  }
}
loadQuestions();

//func count up timer
let time = 1; // Thời gian bắt đầu từ 0 giây
const timerDisplayMinute = document.querySelector(".count-up-timer span");
const timerDisplaySecond = document.querySelector(
  ".count-up-timer span:nth-child(3)"
);
function startCountUpTime() {
  const countdown = setInterval(() => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    // Định dạng thời gian
    timerDisplayMinute.textContent = `${String(minutes).padStart(2, "0")}`;
    timerDisplaySecond.textContent = `${String(seconds).padStart(2, "0")}`;

    // Tăng thời gian
    time++;

    // Bạn có thể dừng bộ đếm theo ý muốn
    // Ví dụ: dừng sau 1 giờ
    if (time >= 3600) {
      clearInterval(countdown);
      timerDisplay.textContent = "Đã dừng!";
    }
  }, 1000);
}
