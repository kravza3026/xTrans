export class Animations {
	constructor() {
		this.buttons = document.querySelectorAll('.animation'); // Знаходимо всі елементи з класом .animation
		this.intervals = new Map(); // Створюємо мапу для збереження інтервалів

		this.buttons.forEach((button) => {
			const interval = setInterval(() => this.dotsShow(button), 800);
			this.intervals.set(button, interval);

			// Очистка анімації при наведенні (якщо потрібно)
			// button.addEventListener('mouseleave', () => {
			// 	clearInterval(this.intervals.get(button));
			// });
		});
	}

	dotsShow(button) {
		const buttonRect = button.getBoundingClientRect();
		const bt = buttonRect.top;
		const bl = buttonRect.left;
		const nl = bl + Math.random() * 60;
		const nl2 = bl - Math.random() * 60;
		const nt = bt - 40 + Math.random() * 50;
		const n2l = Math.random() * 500;
		const n2t = Math.random() * 200;
		const n3l = Math.random() * 500;
		const n3t = Math.random() * 200;

		this.createAndAnimateDot('dots', nt, nl, -n2t, n2l);
		this.createAndAnimateDot('dots2', nt, nl2, -n3t, -n3l);
	}

	createAndAnimateDot(className, top, left, topOffset, leftOffset) {
		const dot = document.createElement('div');
		dot.className = className;
		dot.style.position = 'absolute';
		dot.style.top = `${top}px`;
		dot.style.left = `${left}px`;
		document.body.appendChild(dot);

		dot.animate([
			{ transform: 'translate(0, 0)', opacity: 1 },
			{ transform: `translate(${leftOffset}px, ${topOffset}px)`, opacity: 0 }
		], {
			duration: 7000,
			easing: 'linear'
		}).onfinish = () => {
			dot.remove();
		};
	}
}
