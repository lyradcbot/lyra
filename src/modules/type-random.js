const getRandomNumber = (length: number) => Math.floor(Math.random() * length)

const getRandomWords = (words: string[]) => {
  const response = []
  
  for (let i = 0; i <= words.length; i++) {
    response.push(words[getRandomNumber(words.length)])
  }

  return response
}

module.exports = text;
