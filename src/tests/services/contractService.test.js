import { getContract, getContractById, createContract, editContract, switchContractStatus } from '../../services/contractService';
import { api } from '../../lib/api/config';

jest.mock('../../lib/api/config.js', () => ({
    api: {
        post: jest.fn(),
        patch: jest.fn(),
        get: jest.fn(),
    },
}));

describe('contractService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getContract should return success on successful API call', async () => {
    const mockData = { data: [{ id: 1, name: 'Contract 1' }] };
    api.get.mockResolvedValueOnce({ data: mockData });

    const result = await getContract();

    expect(result).toEqual({ type: 'success', data: mockData });
    expect(api.get).toHaveBeenCalledWith('/contract/');
  });

  test('getContract should return error on failed API call', async () => {
    const mockError = new Error('Network Error');
    api.get.mockRejectedValueOnce(mockError);

    const result = await getContract();

    expect(result).toEqual({ type: 'error', error: mockError });
    expect(api.get).toHaveBeenCalledWith('/contract/');
  });

  test('getContractById should return success on successful API call', async () => {
    const mockData = { data: { id: 1, name: 'Contract 1' } };
    api.get.mockResolvedValueOnce({ data: mockData });

    const result = await getContractById(1);

    expect(result).toEqual({ type: 'success', data: mockData });
    expect(api.get).toHaveBeenCalledWith('/contract/1');
  });

  test('getContractById should return error on failed API call', async () => {
    const mockError = new Error('Network Error');
    api.get.mockRejectedValueOnce(mockError);

    const result = await getContractById(1);

    expect(result).toEqual({ type: 'error', error: mockError });
    expect(api.get).toHaveBeenCalledWith('/contract/1');
  });

  test('createContract should return success on successful API call', async () => {
    const mockData = { id: 1, name: 'New Contract' };
    const requestData = { name: 'New Contract' };
    api.post.mockResolvedValueOnce({ data: mockData });

    const result = await createContract(requestData);

    expect(result).toEqual({ type: 'success', data: mockData });
    expect(api.post).toHaveBeenCalledWith('/contract/create', requestData);
  });

  test('createContract should return error on failed API call', async () => {
    const mockError = new Error('Network Error');
    const requestData = { name: 'New Contract' };
    api.post.mockRejectedValueOnce(mockError);

    const result = await createContract(requestData);

    expect(result).toEqual({ type: 'error', error: mockError });
    expect(api.post).toHaveBeenCalledWith('/contract/create', requestData);
  });

  test('editContract should return success on successful API call', async () => {
    const mockData = { id: 1, name: 'Updated Contract' };
    const requestData = { name: 'Updated Contract' };
    api.patch.mockResolvedValueOnce({ data: mockData });

    const result = await editContract(1, requestData);

    expect(result).toEqual({ type: 'success', data: mockData });
    expect(api.patch).toHaveBeenCalledWith('/contract/1', requestData);
  });

  test('editContract should return error on failed API call', async () => {
    const mockError = new Error('Network Error');
    const requestData = { name: 'Updated Contract' };
    api.patch.mockRejectedValueOnce(mockError);

    const result = await editContract(1, requestData);

    expect(result).toEqual({ type: 'error', error: mockError });
    expect(api.patch).toHaveBeenCalledWith('/contract/1', requestData);
  });

  test('switchContractStatus should return success on successful API call', async () => {
    const mockData = { id: 1, status: 'Active' };
    api.patch.mockResolvedValueOnce({ data: mockData });

    const result = await switchContractStatus(1);

    expect(result).toEqual({ type: 'success', data: mockData });
    expect(api.patch).toHaveBeenCalledWith('/contract/changeStatus/1');
  });

  test('switchContractStatus should return error on failed API call', async () => {
    const mockError = new Error('Network Error');
    api.patch.mockRejectedValueOnce(mockError);

    const result = await switchContractStatus(1);

    expect(result).toEqual({ type: 'error', error: mockError });
    expect(api.patch).toHaveBeenCalledWith('/contract/changeStatus/1');
  });
});