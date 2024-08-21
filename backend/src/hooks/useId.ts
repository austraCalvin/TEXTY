import crypto from "crypto";

const useId = crypto.randomUUID.bind({});

export default useId;