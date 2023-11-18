const branch = (testFn, left, right) => function middleware(req, res, next) {
    const execution = testFn(req, res) ? left : right;
    if (typeof execution === "undefined") {
        next();
        return;
    }
    if (typeof execution === "function") {
        execution(req, res, next);
        return;
    }
    const execute = (targetIndex) => {
        const done = () => {
            if (targetIndex === execution.length - 1) {
                next();
            }
            else {
                execute(targetIndex + 1);
            }
        };
        execution[targetIndex](req, res, done);
    };
    execute(0);
};
export default branch;
