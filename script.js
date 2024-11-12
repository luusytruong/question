function getQuestions() {
  const questions = document.querySelectorAll(".question-standalone-box"); // Chọn tất cả câu hỏi
  const questionArray = []; // Mảng để lưu trữ câu hỏi

  questions.forEach((question) => {
      const questionText = question.querySelector("span.ng-star-inserted").innerText; // Lấy nội dung câu hỏi
      const options = []; // Mảng để lưu trữ các tùy chọn

      question.querySelectorAll("div.list-answer span.ng-star-inserted").forEach((answer) => {
          options.push(answer.innerText); // Thêm từng đáp án vào mảng
      });

      // Giả định rằng đáp án đúng là đáp án cuối cùng trong danh sách
      const correctAnswer = options[options.length - 1];

      // Thêm đối tượng câu hỏi vào mảng
      questionArray.push({
          question: questionText,
          correct_answer: correctAnswer,
          options: options
      });
  });

  // Tạo đối tượng JSON
  const jsonOutput = {
      questions: questionArray
  };

  // In ra console dưới dạng JSON
  console.log(JSON.stringify(jsonOutput, null, 2)); // Định dạng đẹp
}

// Gọi hàm
getQuestions();