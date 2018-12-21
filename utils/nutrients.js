export default calculate = (weight, height, age, male, female, effort, maintenance) => {  
  weight = Number(weight);
  height = Number(height);
  age = Number(age);
  if (male) {
    rest = 5;
  }
  if (female) {
    rest = -161;
  }
  let bmr = 10 * weight + 6.25 * height - 5 * age + rest;
  let calories = Math.round((bmr * effort) * (maintenance + 100) / 100);
  let carbs = Math.round(0.5 * calories / 4);
  let protein = Math.round(0.25 * calories / 4);
  let fat = Math.round(0.25 * calories / 9);
  return {
    calories,
    protein,
    carbs,
    fat
  }
}