import { StateMachine }  from "./js/mrsun-statemachine/sm.mjs"

const sm = window.sm = StateMachine.create();

StateMachine.start(sm);

console.log(sm)