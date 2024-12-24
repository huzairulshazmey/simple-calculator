document.addEventListener('DOMContentLoaded', function () {
    let currentInput = '';
    let firstOperand = null;
    let operator = '';
    let waitingForSecondOperand = false;

    function updateDisplay() {
        const display = document.querySelector('.calculator-screen');
        display.value = currentInput || '0';
    }

    const keys = document.querySelector('.calculator-keys');
    keys.addEventListener('click', (event) => {
        const { target } = event;
        if (!target.matches('button')) {
            return;
        }

        const value = target.value;

        if (value === 'AC') {
            currentInput = '0';
            firstOperand = null;
            operator = '';
            waitingForSecondOperand = false;
        } else if (value === 'C') {
            currentInput = currentInput.slice(0, -1) || '0';
        } else if (value === '=') {
            if (operator && firstOperand !== null) {
                const parts = currentInput.split(' ');
                const secondOperand = parseFloat(parts[2] || currentInput);
                
                if (!isNaN(secondOperand)) {
                    const result = calculate(firstOperand, operator, secondOperand);
                    const formattedResult = Number.isInteger(result) ? result : parseFloat(result.toFixed(4));
                    
                    const originalFirstOperand = firstOperand;
                    
                    currentInput = `${firstOperand} ${operator} ${secondOperand} = ${formattedResult}`;
                    firstOperand = formattedResult;
                    waitingForSecondOperand = false;

                    const historyList = document.querySelector('.calculation-history');
                    const historyItem = document.createElement('li');
                    historyItem.textContent = `${originalFirstOperand} ${operator} ${secondOperand} = ${formattedResult}`;
                    historyList.appendChild(historyItem);
                }
            }
        } else if (['+', '-', '*', '/', '%'].includes(value)) {
            if (currentInput.includes('=')) {
                firstOperand = parseFloat(currentInput.split('=')[1].trim());
                currentInput = firstOperand.toString();
            }
            
            if (!operator && currentInput) {
                firstOperand = parseFloat(currentInput);
                operator = value;
                currentInput = `${firstOperand} ${operator} `;
                waitingForSecondOperand = true;
            }
        } else {
            if (currentInput.includes('=')) {
                currentInput = value;
                firstOperand = null;
                operator = '';
            } else if (waitingForSecondOperand) {
                currentInput += value;
            } else {
                currentInput = currentInput === '0' ? value : (currentInput + value);
            }
        }

        updateDisplay();
    });

    function calculate(first, op, second) {
        first = parseFloat(first);
        second = parseFloat(second);
        
        switch(op) {
            case '+': return first + second;
            case '-': return first - second;
            case '*': return first * second;
            case '/': return second === 0 ? 'Error' : first / second;
            case '%': return (first * second) / 100;
            default: return second;
        }
    }

    updateDisplay();

    const clearHistoryButton = document.querySelector('.clear-history');
    clearHistoryButton.addEventListener('click', () => {
        const historyList = document.querySelector('.calculation-history');
        historyList.innerHTML = '';
    });
});