import SourceMap from 'source-map';

const locateMap = async (mapContent, fileName, lineNum) => {
  const consumer = await new SourceMap.SourceMapConsumer(mapContent);
  const originalSourceIndex = consumer.sources.indexOf(fileName);
  const originalSourceLines = consumer.sourcesContent[originalSourceIndex];

  if (!originalSourceLines) return undefined;

  const trimSource = originalSourceLines.split('\n');
  const blockLineIndex = {
    max: lineNum - 1 + 7,
    min: lineNum - 1 - 7,
  };

  if (blockLineIndex.max > trimSource.length) {
    blockLineIndex.max = trimSource.length;
  }

  if (blockLineIndex.min < 0) {
    blockLineIndex.min = 0;
  }

  const codeBlock = trimSource.slice(blockLineIndex.min, blockLineIndex.max + 1);
  const errorLine = trimSource[lineNum - 1].trim();
  return {
    codeBlock: codeBlock.join('\n'),
    errorLine,
  };
};

export default locateMap;
