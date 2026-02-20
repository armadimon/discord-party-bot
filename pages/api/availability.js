import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export default async function handler(req, res) {
  try {
    const rawKey = process.env.GOOGLE_PRIVATE_KEY || '';
    // 정규표현식 리터럴 대신 문자열 처리를 사용하여 빌드 에러 방지
    const privateKey = rawKey.split('\\n').join('\n');
    
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    const data = rows.map(row => ({
      timestamp: row.get('날짜(Timestamp)') || '',
      username: row.get('유저명(Username)') || '',
      time: row.get('가능시간(Time)') || ''
    }));

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: '데이터를 가져오는데 실패했습니다.' });
  }
}
