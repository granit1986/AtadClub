function onClick()
{
	this.hasCheck = !this.hasCheck;
	if(this.hasCheck)
	{
		Alloy.Collections.selectedDeals.push({id:this.rowid, title: $.titleLbl.text});
	}
	else
	{
		var id = this.rowid;
		Alloy.Collections.selectedDeals = Alloy.Collections.selectedDeals.filter(function(item){ return item.id !== id; });		
	}
}
