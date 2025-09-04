// Helper function to build an image object for Sanity's image URL builder
export function buildImageObj(source) {
  const imageObj = {
    asset: { _ref: source.asset._ref || source.asset._id }
  };

  if (source.crop) imageObj.crop = source.crop;
  if (source.hotspot) imageObj.hotspot = source.hotspot;

  return imageObj;
}

// Helper function to get the URL for a file
export function getFileUrl(source) {
  if (!source || !source.asset) return null;
  const { _ref } = source.asset;
  const fileId = _ref.replace('file-', '').replace(/-pdf$/, '');
  return `https://cdn.sanity.io/files/${process.env.REACT_APP_SANITY_PROJECT_ID}/${process.env.REACT_APP_SANITY_DATASET}/${fileId}.${_ref.endsWith('pdf') ? 'pdf' : 'pdf'}`;
}
