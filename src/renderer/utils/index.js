const genuuid = () => ((+new Date() + (Math.random() * 100)).toString(16).replace('.', '-'));

export default genuuid;
