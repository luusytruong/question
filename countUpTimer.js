let time = 0; // Thời gian bắt đầu từ 0 giây
const timerDisplayMinute = document.querySelector(".count-up-timer span");
const timerDisplaySecond = document.querySelector(
  ".count-up-timer span:nth-child(3)"
);

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
