const Disclaimer = () => {
  return (
    <section className="py-10 bg-white border-t border-gray-200">
      <div className="max-w-4xl mx-auto px-4">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Disclaimer</h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-3">
          This database is provided for information purposes only. Each participating institution has included instruments
          in the database in a complete and accurate manner in order to best provide users the available information. Details of
          the instruments are of a public or private nature and as provided in the database will not be part of any sales or
          purchase, advertisement, or any other form of commercial transaction.
        </p>
        <p className="text-gray-500 text-xs leading-relaxed">
          Some aspects of this database, including the full listing, may only be utilized by registered, qualified, and verified
          users who have been given such access. Public users will be directed to register within this database to request
          full access for specific instruments.
        </p>
      </div>
    </section>
  );
};

export default Disclaimer;
