var recipeConversionApp = angular.module('recipeConversionApp',['ngAnimate']);

recipeConversionApp.controller('Control', ['$scope','$timeout','$sce', function($scope,$timeout,$sce) {
    
    $scope.title = 'Original';
    $scope.showConvertWindow = false;
    $scope.showQuantityError = false;
    $scope.showIncompleteRecipeError = false;
    $scope.showDuplicateIngredientsError = false;
    
    $scope.items = [{"ingredient":"", 
                     "quantity":"", 
                     "unit":'', 
                     "ingredientError":false, 
                     "quantityError":false,
                     "unitError":false
                    }];
    
    $scope.units = [ "Teaspoons","Tablespoons","Cups","N/A" ];
    $scope.convertTo = {    "ingredient":"", 
                            "quantity":"", 
                            "unit":'', 
                            "ingredientError":false, 
                            "quantityError":false,
                            "unitError":false   };
    $scope.ingredients = [];
    
    
    
    
    $scope.hasDuplicateIngredients = function(){
        var counts = [];
        for( i in $scope.items ) {
            
            if( counts[$scope.items[i].ingredient] === undefined ) {
                if($scope.items[i].ingredient != '' ) {
                    counts[$scope.items[i].ingredient] = 1;
                }
            } else {
                $scope.showDuplicateIngredientsError = true;
                $scope.items[i].ingredient = '';
                $scope.fadeInThreeSeconds('showDuplicateIngredientsError');
          
            }
        }
    }
    
    $scope.closeError = function(toClose){
        $scope[toClose] = false;
    }
    
    $scope.init = function () {
        $scope.loadIngredients();
    };
   
    $scope.setShowConvertWindow = function(){
        if($scope.isReadyToConvert($scope.items)) $scope.showConvertWindow = !$scope.showConvertWindow;
        else {
            $scope.showIncompleteRecipeError = true;
            $scope.fadeInThreeSeconds('showIncompleteRecipeError');
        }
    }
    
    $scope.fadeInThreeSeconds = function(field){
        $timeout( function(){ $scope[field] = false; }, 3000 );
    }
    
    $scope.eraseError = function(index,field,errorBoolean){
        
        if( $scope.items[index][errorBoolean] === true ){
            if ( $scope.items[index][field].length >= 1 ){
                $scope.items[index][errorBoolean] = false;
            }
        }
    }
    
    $scope.eraseConvertErrors = function(field,errorBoolean){
        if( $scope.convertTo[errorBoolean] = true ){
            if( $scope.convertTo[field].length >= 1 ){
                $scope.convertTo[errorBoolean] = false;
               }
        }
    }
    
    $scope.isReadyToConvert = function(array){
        
        var isReady = true;
        
        for( i in array ){
            
            var result = $scope.assignRowErrors(array[i])
            if (isReady === true) isReady = result;   
        }
        return isReady;
    }
    
    $scope.assignRowErrors = function(row){
        var isReady = true;
        if ( row.ingredient.length < 1 ){
            isReady = false;
            row.ingredientError = true;
        }
        if ( row.quantity.length   < 1){
            isReady = false;
            row.quantityError = true;
        }
        if ( row.unit.length<1){
            isReady = false;
            row.unitError = true;
        }
        return isReady;
    }
    
    

    $scope.clear = function(item, index){
        $scope.items[index][item]='';
    }
    
    $scope.addRow = function(){
        $scope.items.push({"ingredient":"", "quantity":"", "unit":''});
        $scope.loadIngredients();
    };
    
    $scope.removeRow = function(index){
        $scope.items.splice(index,1); 
        $scope.loadIngredients();
    }
    
    $scope.loadIngredients = function(){
        $scope.ingredients.length = 0;
        for (i in $scope.items){
            $scope.ingredients.push($scope.items[i].ingredient);
        }
    }
    
    $scope.getElementWith = function(item) {
        return item.ingredient === $scope.convertTo.ingredient;
    }
    
    $scope.convert = function(){
        if($scope.assignRowErrors($scope.convertTo)) $scope.doConvert();
        else{
            $scope.showIncompleteRecipeError = true;
            $scope.fadeInThreeSeconds('showIncompleteRecipeError');
        }
    }
  
    $scope.doConvert = function(){
        
        var index = $scope.items.findIndex( $scope.getElementWith );
        var original = $scope.items[index];

        var unitConversion = $scope.getUnitConversion(original, $scope.convertTo);
        
        var conversionFactor = $scope.convertTo.quantity / original.quantity * unitConversion;
        
        for( i in $scope.items ){
            $scope.items[i].quantity *= conversionFactor;    
        }
        $scope.title = 'Converted';
        $scope.showConvertWindow = false;
    }
    
    $scope.getUnitConversion = function(original,convert){
        
        if(original.unit === convert.unit) return 1;
        
        if(original.unit === 'Teaspoons'){
            if (convert.unit ==='Tablespoons') return 3;
            if (convert.unit ==='Cups' )return 48;
        }
        
        if(original.unit === 'Tablespoons'){
            if (convert.unit ==='Teaspoons') return .33;
            if (convert.unit ==='Cups') return 16;;
        }
        
        if(original.unit === 'Cups'){
            if (convert.unit ==='Tablespoons') return .0625;
            if (convert.unit ==='Teaspoons') return .02083;
        }
    }
  
    $scope.checkNAN = function(item){
        
        var trimmed = removeAllWhitespaces(item.quantity);
       
        if(isNaN(trimmed)){
            item.quantity = item.quantity.substring(0, item.quantity.length-1 );
            $scope.showQuantityError = true;
            $scope.fadeInThreeSeconds('showQuantityError');
         }
    }
    
    removeAllWhitespaces = function(text){
        return text.replace(/\s+/g, '');
    }
 
    $scope.tooltip = $sce.trustAsHtml(
            "<div style = 'width: 100%; text-align: center;'>"+
                "Decimal Conversion Chart"+
              "</div>"+
              "<hr style = 'border-top: 1px solid white;'/>"+
              "<table class = 'toolTipTable'>"+
                "<tr>"+
                  "<td>Fraction</td>"+
                  "<td>Decimal</td>"+
                  "<td>Example</td>"+
                "</tr>"+
                "<tr>"+
                  "<td>1/8</td>"+
                  "<td>0.125</td>"+
                  "<td>1/8 Teaspoon = 0.125 Teaspoon</td>"+
                "</tr>"+
                "<tr>"+
                  "<td>1/4</td>"+
                  "<td>0.25</td>"+
                  "<td>1/4 Teaspoon = 0.25 Teaspoon</td>"+
                "</tr>"+
                "<tr>"+
                  "<td>1/3</td>"+
                  "<td>0.33</td>"+
                  "<td>2 1/3 Cups = 2.33 Cups</td>"+
                "</tr>"+
                "<tr>"+
                  "<td>1/2</td>"+
                  "<td>0.50</td>"+
                  "<td>1 1/2 Tablespoons = 1.50 Tablespoons</td>"+
                "</tr>"+
                "<tr>"+
                  "<td>2/3</td>"+
                  "<td>0.66</td>"+
                  "<td>2 2/3 Cups = 2.66 Cups</td>"+
                "</tr>"+
                "<tr>"+
                  "<td>3/4</td>"+
                  "<td>0.75</td>"+
                  "<td>1 3/4 Tablespoons = 1.75 Tablespoons</td>"+
                "</tr>"+
              "</table>");
    
}]);
