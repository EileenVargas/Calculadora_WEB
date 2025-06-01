var current = '';
var calcHistory = JSON.parse(localStorage.getItem('calcHistory')) || [];
var justCalculated = false;
var lastResult = '';

function updateDisplay() {
  document.getElementById('expression').innerText = current;
  document.getElementById('result').innerText = current === '' ? '0' : '';
}

function appendValue(val) {
  if (val === '+/-') {
    toggleSign();
    return;
  }

  if (justCalculated) {
    if (/[+\-*/]/.test(val)) {
      current = lastResult + val;
    } else {
      current = val === ',' ? '.' : val;
    }
    justCalculated = false;
  } else {
    current += val === ',' ? '.' : val;
  }

  updateDisplay();
}

function toggleSign() {
  if (!current) return;
  try {
    var num = evalSafe(current);
    if (num !== null) {
      current = String(-1 * num);
    }
  } catch (e) {}
}

function clearCalc() {
  current = '';
  updateDisplay();
}

function calculate() {
  if (!current || current.trim() === '') {
    alert('Expresión vacía');
    return;
  }

  if (/[+\-*/.]$/.test(current)) {
    alert('Expresión incompleta o inválida');
    return;
  }

  var originalExpr = current;

  var expressionToEvaluate = current.replace(/(\d+(\.\d+)?)%/g, function(match, number) {
    return parseFloat(number) / 100;
  });

  try {
    var resultValue = evalSafe(expressionToEvaluate);

    if (resultValue !== null && !isNaN(resultValue)) {
      var record = originalExpr + '=' + resultValue;
      calcHistory.push(record);
      localStorage.setItem('calcHistory', JSON.stringify(calcHistory));

      document.getElementById('expression').innerText = originalExpr;
      document.getElementById('result').innerText = resultValue;

      lastResult = resultValue.toString();
      current = '';
      justCalculated = true;
    } else {
      alert('Error al calcular el resultado');
    }
  } catch (e) {
    alert('Error en la expresión: ' + e.message);
  }
}

function evalSafe(expr) {
  try {
    return Function('"use strict";return (' + expr + ')')();
  } catch (e) {
    return null;
  }
}

document.getElementById('clear-entry').addEventListener('click', function () {
  if (justCalculated) {
    current = '';
    justCalculated = false;
  } else if (current.length > 0) {
    current = current.slice(0, -1);
  }
  updateDisplay();
  document.getElementById('result').innerText = '';
});

// Muestra el historial
document.getElementById('show-history').addEventListener('click', function () {
  var panel = document.getElementById('history-panel');
  panel.classList.toggle('hidden');
  var list = document.getElementById('history-list');
  list.innerHTML = '';
  calcHistory.forEach(function (entry) {
    var li = document.createElement('li');
    li.textContent = entry;
    list.appendChild(li);
  });
});

// Elimina el historial
function clearHistory() {
  calcHistory = [];
  localStorage.removeItem('calcHistory');
  document.getElementById('history-list').innerHTML = '';
}