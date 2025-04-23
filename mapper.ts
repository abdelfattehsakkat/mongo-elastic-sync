export const mapDocument = (doc: any) => {
    const { _id, ...rest } = doc;
    return {
      id: _id,
      ...rest
    };
  };
  