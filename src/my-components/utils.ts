export const plural = (count, singular, plural) => {
    return count === 1 ? singular : plural;
};

export const getQuestionIdx = (questions, question) => {
    return questions.findIndex((q1) => q1.id === question.id);
};
