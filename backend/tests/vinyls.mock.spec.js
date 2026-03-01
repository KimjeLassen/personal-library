const Vinyl = require('../models/vinyl');
const pool = require('../db');

jest.mock('../db');

describe('Vinyl Model', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll()', () => {
    it('should return all vinyls', async () => {
      const mockVinyls = [
        { vinyl_id: 1, title: 'Album 1', artist: 'Artist 1', release_year: 2020, genre: 'Rock' },
        { vinyl_id: 2, title: 'Album 2', artist: 'Artist 2', release_year: 2021, genre: 'Jazz' },
      ];
      pool.query.mockResolvedValue({ rows: mockVinyls });

      const result = await Vinyl.getAll();

      expect(result).toEqual(mockVinyls);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM vinyl');
    });

    it('should handle database errors gracefully', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      await expect(Vinyl.getAll()).rejects.toThrow('Database error');
    });
  });

  describe('getById()', () => {
    it('should return vinyl by id', async () => {
      const mockVinyl = { vinyl_id: 2, title: 'Test Album', artist: 'Test Artist', release_year: 2020, genre: 'Pop' };
      pool.query.mockResolvedValue({ rows: [mockVinyl] });

      const result = await Vinyl.getById(2);

      expect(result).toEqual(mockVinyl);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM vinyl WHERE vinyl_id = $1', [2]);
    });

    it('should return undefined if vinyl not found', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await Vinyl.getById(999);

      expect(result).toBeUndefined();
    });

    it('should handle database errors', async () => {
      pool.query.mockRejectedValue(new Error('Database connection failed'));

      await expect(Vinyl.getById(2)).rejects.toThrow('Database connection failed');
    });
  });

  describe('create()', () => {
    it('should create a new vinyl', async () => {
      const newVinyl = { title: 'New Album', artist: 'New Artist', release_year: 2023, genre: 'Blues' };
      const createdVinyl = { vinyl_id: 3, ...newVinyl };
      pool.query.mockResolvedValue({ rows: [createdVinyl] });

      const result = await Vinyl.create(newVinyl);

      expect(result).toEqual(createdVinyl);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO vinyl'),
        [newVinyl.title, newVinyl.artist, newVinyl.release_year, newVinyl.genre]
      );
    });

    it('should handle missing required fields', async () => {
      const incompleteVinyl = { title: 'Album without artist' };
      pool.query.mockRejectedValue(new Error('Missing required field'));

      await expect(Vinyl.create(incompleteVinyl)).rejects.toThrow('Missing required field');
    });

    it('should handle database errors during insert', async () => {
      const newVinyl = { title: 'Album', artist: 'Artist', release_year: 2023, genre: 'Pop' };
      pool.query.mockRejectedValue(new Error('Insert failed'));

      await expect(Vinyl.create(newVinyl)).rejects.toThrow('Insert failed');
    });
  });

  describe('update()', () => {
    it('should update an existing vinyl', async () => {
      const updateData = { title: 'Updated Title', artist: 'Updated Artist', release_year: 2024, genre: 'Funk' };
      const updatedVinyl = { vinyl_id: 1, ...updateData };
      pool.query.mockResolvedValue({ rows: [updatedVinyl] });

      const result = await Vinyl.update(1, updateData);

      expect(result).toEqual(updatedVinyl);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE vinyl SET'),
        [updateData.title, updateData.artist, updateData.release_year, updateData.genre, 1]
      );
    });

    it('should handle update errors', async () => {
      const updateData = { title: 'Title', artist: 'Artist', release_year: 2024, genre: 'Pop' };
      pool.query.mockRejectedValue(new Error('Update failed'));

      await expect(Vinyl.update(1, updateData)).rejects.toThrow('Update failed');
    });
  });

  describe('delete()', () => {
    it('should delete a vinyl by id', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await Vinyl.delete(1);

      expect(result).toEqual({ success: true });
      expect(pool.query).toHaveBeenCalledWith('DELETE FROM vinyl WHERE vinyl_id = $1', [1]);
    });

    it('should handle delete errors', async () => {
      pool.query.mockRejectedValue(new Error('Delete failed'));

      await expect(Vinyl.delete(1)).rejects.toThrow('Delete failed');
    });
  });
});