import SourceMap from 'source-map';

const extractSource = async sourceMapFile => {
  const consumer = await new SourceMap.SourceMapConsumer(sourceMapFile);
  const sources = consumer.sources.map(source => {
    const output = {
      source,
      content: consumer.sourceContentFor(source),
    };
    return JSON.stringify(output);
  });
  consumer.destroy();
  return sources.join('');
};

export default extractSource;
