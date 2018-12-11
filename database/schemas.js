export const profileSchema = {
  name: 'profile',
  primaryKey: 'id',
  properties: {
    id: { type: 'int', default: 0 },
    male: { type: 'bool', default: false },
    female: { type: 'bool', default: false },
    weight: { type: 'int', default: 0 },
    height: { type: 'int', default: 0 },
    age: { type: 'int', default: 0 },
    effort: { type: 'double', default: 1.2 },
    maintenance: { type: 'int', default: 0 }
  }
}


export const foodSchema = {
  name: 'food',
  primaryKey: 'id',
  properties: {
    id: 'string',
    name: 'string',
    protein: 'double',
    carbs: 'double',
    fat: 'double',
    calories: 'int'
  }
}

export const writeProfile = (realm, male, female, weight, height, age, effort, maintenance) => {
  if (!realm) {
    return;
  }
  weight = Number(weight);
  height = Number(height);
  age = Number(age);
  const profile = realm.objectForPrimaryKey('profile', 0);
  try {
    realm.write(() => {
      if (profile) {
        profile.male = male;
        profile.female = female;
        profile.weight = weight;
        profile.height = height;
        profile.age = age;
        profile.effort = effort;
        profile.maintenance = maintenance;
      } else {
        realm.create('profile', {
          male,
          female,
          weight,
          height,
          age,
          effort,
          maintenance
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
}