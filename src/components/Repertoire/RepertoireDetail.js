import React from 'react';

const DetailSection = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-1 mb-2">
      {title}
    </h3>
    <div className="text-gray-700">{children}</div>
  </div>
);

const ListSection = ({ title, items }) => (
  items && items.length > 0 && (
    <DetailSection title={title}>
      <ul className="list-disc pl-5 space-y-1">
        {items.map((item, index) => (
          <li key={index} className="text-gray-700">{item}</li>
        ))}
      </ul>
    </DetailSection>
  )
);

const RepertoireDetail = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">{item.title}</h2>
              <p className="text-xl text-gray-600">{item.composer}</p>
              {item.year && (
                <p className="text-gray-500">{item.year}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="mt-8 space-y-6">
            {item.style && (
              <DetailSection title="Style">
                <p>{item.style}</p>
              </DetailSection>
            )}

            {item.duration && (
              <DetailSection title="Duration">
                <p>{item.duration}</p>
              </DetailSection>
            )}

            {item.instruments && item.instruments.length > 0 && (
              <DetailSection title="Instruments">
                <p>{item.instruments.join(', ')}</p>
              </DetailSection>
            )}

            {item.description && (
              <DetailSection title="Description">
                <p className="leading-relaxed">{item.description}</p>
              </DetailSection>
            )}

            {item.movements && item.movements.length > 0 && (
              <DetailSection title={item.movements.length > 1 ? "Movements" : "Movement"}>
                <ol className="list-decimal pl-5 space-y-1">
                  {item.movements.map((movement, idx) => (
                    <li key={idx} className="text-gray-700">
                      {movement}
                      {item.durations && item.durations[idx] && (
                        <span className="text-sm text-gray-500 ml-2">{item.durations[idx]}</span>
                      )}
                    </li>
                  ))}
                </ol>
              </DetailSection>
            )}

            {item.premieredBy && (
              <DetailSection title="Premiere">
                <p>{item.premieredBy}</p>
              </DetailSection>
            )}

            {item.dedicatedTo && (
              <DetailSection title="Dedication">
                <p>{item.dedicatedTo}</p>
              </DetailSection>
            )}

            <ListSection title="Notable Recordings" items={item.notableRecordings} />
            <ListSection title="Key Recordings" items={item.keyRecordings} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepertoireDetail;
