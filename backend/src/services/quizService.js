exports.evaluateQuiz = async (answers, correctAnswers) => {
    let score = 0;
    const suggestions = [];
  
    answers.forEach((answer, index) => {
      if (answer === correctAnswers[index]) {
        score++;
      } else {
        suggestions.push(`Revise question ${index + 1}`);
      }
    });
  
    return { score, suggestions };
  };
  