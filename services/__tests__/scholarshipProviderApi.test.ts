import { scholarshipProviderApi, getCalendarEvents, createCalendarEvent, updateCalendarEvent, deleteCalendarEvent } from '../scholarshipProviderApi';
import apiService from '../apiService';
jest.mock('../apiService');

describe('scholarshipProviderApi.createScholarship', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('maps _new suffix fields to backend fields without suffix', async () => {
    const mockData: any = {
      scholarship_types_new: [{ type: 'Merit' }],
      selection_rubric_new: [{ criteria: 'GPA' }],
      faqs_new: [{ question: 'Test?' }],
      gallery_images_new: [{ url: 'test.jpg' }],
      exam_centers_new: [{ province: 'Province 1' }],
    };

    (apiService.post as jest.Mock).mockResolvedValue({ data: {} });
    await scholarshipProviderApi.createScholarship(mockData);

    expect(apiService.post).toHaveBeenCalledWith(
      '/scholarship-providers/scholarships',
      expect.objectContaining({
        scholarship_types: mockData.scholarship_types_new,
        selection_rubric: mockData.selection_rubric_new,
        faqs: mockData.faqs_new,
        gallery_images: mockData.gallery_images_new,
        exam_centers: mockData.exam_centers_new,
      })
    );
    const calledWith = (apiService.post as jest.Mock).mock.calls[0][1];
    expect(calledWith).not.toHaveProperty('scholarship_types_new');
    expect(calledWith).not.toHaveProperty('selection_rubric_new');
  });

  it('handles missing _new fields without crashing', async () => {
    const mockData: any = {
      title: 'Test Scholarship',
      value: '1000',
    };

    (apiService.post as jest.Mock).mockResolvedValue({ data: {} });
    await expect(scholarshipProviderApi.createScholarship(mockData)).resolves.not.toThrow();

    expect(apiService.post).toHaveBeenCalledWith(
      '/scholarship-providers/scholarships',
      expect.objectContaining(mockData)
    );
  });

  it('maps falsy _new values (empty arrays)', async () => {
    const mockData = {
      scholarship_types_new: [],
      selection_rubric_new: [],
      faqs_new: [],
      gallery_images_new: [],
      exam_centers_new: [],
    };

    (apiService.post as jest.Mock).mockResolvedValue({ data: {} });
    await scholarshipProviderApi.createScholarship(mockData);

    const calledWith = (apiService.post as jest.Mock).mock.calls[0][1];
    expect(calledWith.scholarship_types).toEqual([]);
    expect(calledWith.selection_rubric).toEqual([]);
    expect(calledWith).not.toHaveProperty('scholarship_types_new');
  });

  it('handles conflicts between _new and legacy fields (_new wins)', async () => {
    const mockData = {
      scholarship_types_new: [{ type: 'New' }],
      scholarship_types: [{ type: 'Legacy' }],
    };

    (apiService.post as jest.Mock).mockResolvedValue({ data: {} });
    await scholarshipProviderApi.createScholarship(mockData);

    const calledWith = (apiService.post as jest.Mock).mock.calls[0][1];
    expect(calledWith.scholarship_types).toEqual([{ type: 'New' }]);
    expect(calledWith).not.toHaveProperty('scholarship_types_new');
  });
});

describe('scholarshipProviderApi.updateScholarship', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('maps _new suffix fields and calls put with correct URL and data', async () => {
    const id = 123;
    const mockData = {
      scholarship_types_new: [{ type: 'Merit' }],
      selection_rubric_new: [{ criteria: 'GPA' }],
      faqs_new: [{ question: 'Test?' }],
      gallery_images_new: [{ url: 'test.jpg' }],
      exam_centers_new: [{ province: 'Province 1' }],
    };

    (apiService.put as jest.Mock).mockResolvedValue({ data: {} });
    await scholarshipProviderApi.updateScholarship(id, mockData);

    expect(apiService.put).toHaveBeenCalledWith(
      `/scholarship-providers/scholarships/${id}`,
      expect.objectContaining({
        scholarship_types: mockData.scholarship_types_new,
        selection_rubric: mockData.selection_rubric_new,
        faqs: mockData.faqs_new,
        gallery_images: mockData.gallery_images_new,
        exam_centers: mockData.exam_centers_new,
      })
    );
    const calledWith = (apiService.put as jest.Mock).mock.calls[0][1];
    expect(calledWith).not.toHaveProperty('scholarship_types_new');
    expect(calledWith).not.toHaveProperty('selection_rubric_new');
  });

  it('handles missing _new fields without crashing', async () => {
    const id = 123;
    const mockData = {
      title: 'Updated Scholarship',
    };

    (apiService.put as jest.Mock).mockResolvedValue({ data: {} });
    await expect(scholarshipProviderApi.updateScholarship(id, mockData)).resolves.not.toThrow();
  });
});

describe('getCalendarEvents', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls correct endpoint and returns events', async () => {
    const mockEvents = [{ id: 1, title: 'Test Event' }];
    (apiService.get as jest.Mock).mockResolvedValue({ data: { data: mockEvents } });
    const result = await getCalendarEvents();
    expect(apiService.get).toHaveBeenCalledWith('/scholarship-providers/calendar-events');
    expect(result).toEqual(mockEvents);
  });
});

describe('createCalendarEvent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls correct endpoint with data', async () => {
    const mockData = { title: 'New Event', start_date: '2025-01-01' };
    const mockEvent = { id: 1, ...mockData };
    (apiService.post as jest.Mock).mockResolvedValue({ data: mockEvent });
    const result = await createCalendarEvent(mockData);
    expect(apiService.post).toHaveBeenCalledWith('/scholarship-providers/calendar-events', mockData);
    expect(result).toEqual(mockEvent);
  });
});

describe('updateCalendarEvent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls correct endpoint with id and data', async () => {
    const id = 1;
    const mockData = { title: 'Updated Event' };
    const mockEvent = { id, ...mockData };
    (apiService.put as jest.Mock).mockResolvedValue({ data: mockEvent });
    const result = await updateCalendarEvent(id, mockData);
    expect(apiService.put).toHaveBeenCalledWith(`/scholarship-providers/calendar-events/${id}`, mockData);
    expect(result).toEqual(mockEvent);
  });
});

describe('deleteCalendarEvent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls correct endpoint with id', async () => {
    const id = 1;
    (apiService.delete as jest.Mock).mockResolvedValue({ data: {} });
    await deleteCalendarEvent(id);
    expect(apiService.delete).toHaveBeenCalledWith(`/scholarship-providers/calendar-events/${id}`);
  });
});
