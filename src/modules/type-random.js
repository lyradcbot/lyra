function text (arrayOriginal) {
	let arrayAleatoria = arrayOriginal.slice();
	let novaArray = [];
	for (let i = 0; i < 20; i++) {
	  let indiceAleatorio = Math.floor(Math.random() * arrayAleatoria.length);
	  novaArray.push(arrayAleatoria[indiceAleatorio]);
	  arrayAleatoria.splice(indiceAleatorio, 1);
	}

	return novaArray.join('ㅤㅤ');
}

module.exports = text;