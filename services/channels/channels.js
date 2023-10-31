import _ from "better-sse";
const { createChannel } = _;
const executivePool = createChannel();
const visitorPool = createChannel();
// TODO: We can improve these code by introducing classes and defining commons methods

export { executivePool, visitorPool };
