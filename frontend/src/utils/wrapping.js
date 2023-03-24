

export function wordWrap(str, maxWidth) {
    // Split the input string into words
    const words = str.split(' ');
  
    let lines = [];
    let currentLine = '';
  
    for (const word of words) {
      if (currentLine.length + word.length <= maxWidth) {
        // If the current line length plus the word length is within the limit,
        // add the word to the current line
        currentLine += (currentLine.length === 0 ? '' : ' ') + word;
      } else {
        if (currentLine.length > 0) {
          // If the word doesn't fit, push the current line to the lines array
          lines.push(currentLine);
          currentLine = '';
        }
  
        // If the word itself is longer than the maxWidth, split it
        if (word.length > maxWidth) {
          let remainingWord = word;
          while (remainingWord.length > maxWidth) {
            lines.push(remainingWord.slice(0, maxWidth));
            remainingWord = remainingWord.slice(maxWidth);
          }
          currentLine = remainingWord;
        } else {
          currentLine = word;
        }
      }
    }
  
    // Add the last line to the lines array
    lines.push(currentLine);
  
    // Join the lines array with line breaks to form the wrapped text
    return lines.join('\n');
  }
  