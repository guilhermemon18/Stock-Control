import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subject, subscribeOn, takeUntil } from 'rxjs';
import { EditCategoryAction } from 'src/app/models/interfaces/categories/event/EditCategoryAction';
import { CategoryEvent } from 'src/app/models/interfaces/enums/categories/CategoryEvent';
import { CategoriesService } from 'src/app/services/categories/categories.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: []
})
export class CategoryFormComponent implements OnInit, OnDestroy {

  private readonly destroy$: Subject<void> = new Subject();
  private addCategoryAction = CategoryEvent.ADD_CATEGORY_ACTION;
  private editCategoryAction = CategoryEvent.EDIT_CATEGORY_ACTION;

  public categoryAction!: { event: EditCategoryAction };
  public categoryForm = this.formBuilder.group({
    name: ['', Validators.required],
  });

  constructor(
    public ref: DynamicDialogConfig,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private categoriesService: CategoriesService,
  ) { }

  ngOnInit(): void {
    this.categoryAction = this.ref.data;

    if (
      (this.categoryAction?.event?.action === this.editCategoryAction &&
        this.categoryAction?.event?.categoryName !== null) ||
      undefined
    ) {
      this.setCategoryName(this.categoryAction?.event?.categoryName as string);
    }
  }

  handleSubmitCategoryAction(): void {
    if(this.categoryAction?.event?.action === this.addCategoryAction){
      this.handleSubmiteAddCategory();
    }else if(this.categoryAction?.event?.action === this.editCategoryAction){
      this.handleSubmitEditCategory();
    }

    return;
  }


  handleSubmiteAddCategory(): void {
    if (this.categoryForm?.value && this.categoryForm?.valid) {
      const requestCreateCategory: { name: string } = {
        name: this.categoryForm.value.name as string,
      };
      this.categoriesService.createNewCategory(requestCreateCategory)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.categoryForm.reset();
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Categoria criada com sucesso',
                life: 3000,
              });
            }
          }, error: (err) => {
            console.log(err);
            this.categoryForm.reset();
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao criar categoria!',
              life: 3000,
            });
          }
        });
    }
  }

  handleSubmitEditCategory(): void {
    if (
      this.categoryForm?.value &&
      this.categoryForm?.valid &&
      this.categoryAction?.event?.id
    ) {
      const requestEditCategory: {name: string, category_id: string} = {
        name: this.categoryForm?.value?.name as string,
        category_id: this.categoryAction?.event?.id,
      }

      this.categoriesService.editCategoryName(requestEditCategory)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.categoryForm.reset();
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Categoria editada com sucesso!',
            life: 3000,
          });
        }, error: (err) => {
          console.log(err);
          this.categoryForm.reset();
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao editar categoria!',
            life: 3000,
          });
        },
      });

    }
  }

  setCategoryName(categoryName: string): void {
    if (categoryName) {
      this.categoryForm.setValue({
        name: categoryName,
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
