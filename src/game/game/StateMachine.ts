export interface IState {
	name: string
	onEnter?: () => void
	onUpdate?: () => void
	onExit?: () => void
}

let idCount = 0;

export default class StateMachine {
	private id = (++idCount).toString();
	private context?: object;
	private states:Map<string, IState> = new Map<string, IState>();
	private previousState?: IState;
	private currentState?: IState;
	private isChangingState = false;
	private changeStateQueue: string[] = [];

	get previousStateName() {
		if (!this.previousState) {
			return ''
		}
		return this.previousState.name
	}

	constructor(context?: object, id?: string) {
		this.id = id ?? this.id;
		this.context = context
	}

	isCurrentState(name: string) {
		if (!this.currentState) {
			return false
		}
		return this.currentState.name === name
	}

	addState(name: string, config?: { onEnter?: () => void, onUpdate?: () => void, onExit?: () => void }):this {
		const context = this.context;
		this.states.set(name, {
			name,
			onEnter: config?.onEnter?.bind(context),
			onUpdate: config?.onUpdate?.bind(context),
			onExit: config?.onExit?.bind(context)
		});
		return this;
	}

	setState(name: string) {
		if (!this.states.has(name)) {
			return;
		}
		else if (this.isCurrentState(name)) {
			return;
		}
		else if (this.isChangingState) {
			this.changeStateQueue.push(name);
			return;
		}
		this.isChangingState = true;
		if (this.currentState && this.currentState.onExit) {
			this.currentState.onExit();
		}
		this.previousState = this.currentState;
		this.currentState = this.states.get(name);
		if (this.currentState!.onEnter) {
			this.currentState!.onEnter();
		}
		this.isChangingState = false;
	}

	update() {
		if (this.changeStateQueue.length > 0) {
			const name = this.changeStateQueue.shift() as string
			this.setState(name);
			return;
		}
		if (this.currentState && this.currentState.onUpdate) {
			this.currentState.onUpdate();
		}
	}
}