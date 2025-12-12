import { MA_CMR_Profile, US_CFR_Profile } from '../../src/ingest/util/ingest.util.regexProfiles';
import { describe, it, expect } from 'vitest';

describe('Regex Profiles', () => {
    it('should identify MA CMR Sections', () => {
        const line = "3.17: Landlord-Tenant";
        // Find the specific level by name
        const profile = MA_CMR_Profile.levels.find(l => l.name === 'SECTION')!;
        expect(profile.regex.test(line)).toBe(true);
    });

    it('should identify Federal CFR Sections', () => {
        const line = "§ 310.4 Abusive telemarketing acts.";
        // [FIX] Was levels[0], now we find SECTION explicitly
        const profile = US_CFR_Profile.levels.find(l => l.name === 'SECTION')!;
        expect(profile.regex.test(line)).toBe(true);
    });

    it('should distinguish MA paragraphs (a) from Fed paragraphs', () => {
        const maLine = "(a) Rent a dwelling unit...";
        
        // MA 'PARAGRAPH' is (a)
        const maProfile = MA_CMR_Profile.levels.find(l => l.name === 'PARAGRAPH')!;
        expect(maProfile.regex.test(maLine)).toBe(true);
    });
});