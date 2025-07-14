// Arabic seed data for people and their relations

export const people = [
  {
    name: 'محمد ﷺ',
    fullName: 'محمد بن عبد الله بن عبد المطلب بن هاشم بن عبد مناف بن قصي بن كلاب بن مرة بن كعب بن لؤي بن غالب بن فهر بن مالك بن النضر بن كنانة بن خزيمة بن مدركة بن إلياس بن مضر بن نزار بن معد بن عدنان.',
    slug: 'prophet-muhammad',
    appearance: 'كان متوسط القامة، عريض المنكبين، كث اللحية، مشرق الوجه، يوصف بأنه أجمل الناس.',
    virtues: 'خاتم الأنبياء، رحمة للعالمين، صاحب الخلق العظيم، قائد، معلم، رجل دولة.',
    picture: null,
  },
  {
    name: 'سعد بن أبي وقاص',
    fullName: 'سعد بن مالك بن وهيب بن عبد مناف بن زهرة القرشي الزهري، أبو إسحاق',
    slug: 'saad-ibn-abi-waqqas',
    appearance: 'كان جميل الوجه، طويل القامة، قوي البنية، اشتهر بمهارته في الرماية.',
    virtues: 'أحد العشرة المبشرين بالجنة، أحد الستة أصحاب الشورى، أول من رمى بسهم في سبيل الله، خال النبي صلى الله عليه وسلم، مستجاب الدعوة، شجاع، قائد في فتح العراق وفارس.',
    picture: null,
  },
];

export const peopleRelations = [
  {
    fromSlug: 'saad-ibn-abi-waqqas',
    toSlug: 'prophet-muhammad',
    type: 'MATERNAL_UNCLE',
  },
  {
    fromSlug: 'prophet-muhammad',
    toSlug: 'saad-ibn-abi-waqqas',
    type: 'MATERNAL_NEPHEW',
  },
]; 