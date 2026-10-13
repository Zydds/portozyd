import { ImageResponse } from 'next/og';

export const alt = 'Zaidan Ghiffari Azhar — QA, Web Development, Project Management';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          backgroundColor: '#0A0A0A',
          color: '#F5F5F5',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 30, color: '#A3A3A3' }}>
          <span
            style={{
              color: '#F5F5F5',
              backgroundColor: '#6366F1',
              padding: '6px 16px',
              marginRight: 20,
              fontWeight: 700,
            }}
          >
            ZYD
          </span>
          <span>Personal Portfolio</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.1 }}>
            Zaidan Ghiffari Azhar
          </div>
          <div style={{ display: 'flex', fontSize: 36, color: '#A3A3A3', marginTop: 24 }}>
            Quality Assurance · Web Development · Project Management
          </div>
        </div>

        <div style={{ display: 'flex', gap: 14 }}>
          {['Security-minded', 'Indonesia', 'zaidanghiffari.my.id'].map((chip) => (
            <div
              key={chip}
              style={{
                display: 'flex',
                fontSize: 26,
                color: '#A3A3A3',
                border: '1px solid #262626',
                padding: '10px 22px',
                borderRadius: 8,
              }}
            >
              {chip}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
