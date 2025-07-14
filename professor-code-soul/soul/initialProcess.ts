import { MentalProcess, useActions, usePerceptions } from "@opensouls/engine";
import externalDialog from "./cognitiveSteps/externalDialog.js";
import internalMonologue from "./cognitiveSteps/internalMonologue.js";

const initialProcess: MentalProcess = async ({ workingMemory }) => {
  const { speak, log } = useActions();
  const { invokingPerception } = usePerceptions();

  log("Professor Code is processing a new message");

  // First, think internally about how to respond
  const withThoughts = await internalMonologue({
    workingMemory,
    params: {},
    step: {},
  });
  log("Internal monologue completed");

  // Then generate the external response
  const finalMemory = await externalDialog({
    workingMemory: withThoughts,
    params: {},
    step: {},
  });
  log("External dialog completed");

  return finalMemory;
};

export default initialProcess;
